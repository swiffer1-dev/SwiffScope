import { db } from '../db';
import { logInfo, logError } from '../utils/logger';

type AlertConditions = {
  chain?: string;
  min_risk_score?: number;
  min_momentum_score?: number;
  lp_locked?: boolean;
  max_age_minutes?: number;
};

async function createAlertEvent(ruleId: number, tokenId: number) {
  await db.query(
    `
    INSERT INTO alert_events (alert_rule_id, token_id, created_at, sent)
    VALUES ($1, $2, NOW(), FALSE)
  `,
    [ruleId, tokenId]
  );
}

export async function runAlertsEvaluator() {
  try {
    logInfo('Running alerts evaluator');
    const rulesRes = await db.query(
      `SELECT id, conditions FROM alert_rules WHERE is_enabled = TRUE`
    );
    const rules = rulesRes.rows;

    const tokensRes = await db.query(
      `
      SELECT t.id,
             t.name,
             t.symbol,
             c.short_name as chain,
             EXTRACT(EPOCH FROM (NOW() - t.first_seen_at)) / 60 as age_minutes,
             r.risk_score,
             r.lp_locked,
             m.momentum_score
      FROM tokens t
      JOIN chains c ON t.chain_id = c.id
      JOIN LATERAL (
        SELECT *
        FROM token_risk_assessments r2
        WHERE r2.token_id = t.id
        ORDER BY r2.calculated_at DESC
        LIMIT 1
      ) r ON TRUE
      JOIN LATERAL (
        SELECT *
        FROM token_momentum_assessments m2
        WHERE m2.token_id = t.id
        ORDER BY m2.calculated_at DESC
        LIMIT 1
      ) m ON TRUE
      WHERE t.is_active = TRUE
    `
    );
    const tokens = tokensRes.rows;

    for (const rule of rules) {
      const cond = rule.conditions as AlertConditions;

      for (const tok of tokens) {
        if (cond.chain && tok.chain !== cond.chain) continue;
        if (
          cond.min_risk_score !== undefined &&
          tok.risk_score < cond.min_risk_score
        ) continue;
        if (
          cond.min_momentum_score !== undefined &&
          tok.momentum_score < cond.min_momentum_score
        ) continue;
        if (cond.lp_locked === true && tok.lp_locked !== true) continue;
        if (
          cond.max_age_minutes !== undefined &&
          tok.age_minutes > cond.max_age_minutes
        ) continue;

        await createAlertEvent(rule.id, tok.id);
      }
    }

    logInfo('Alerts evaluator done');
  } catch (err: any) {
    logError('Error in alerts evaluator', err);
  }
}

if (require.main === module) {
  runAlertsEvaluator().then(() => process.exit(0));
}
