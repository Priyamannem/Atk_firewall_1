from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.models import FirewallRule
from app.core.config import settings as app_settings

class RulesService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_rules(self) -> FirewallRule:
        result = await self.session.execute(select(FirewallRule).order_by(FirewallRule.id.desc()))
        rules = result.scalars().first()
        if not rules:
            # Create default rules
            rules = FirewallRule(
                max_req_per_sec=app_settings.DEFAULT_MAX_REQ_PER_SEC,
                max_req_per_min=app_settings.DEFAULT_MAX_REQ_PER_MIN,
                anomaly_threshold=app_settings.DEFAULT_ANOMALY_THRESHOLD,
                ransomware_entropy_threshold=app_settings.DEFAULT_RANSOMWARE_ENTROPY_THRESHOLD,
                url_reputation_threshold=app_settings.DEFAULT_URL_REPUTATION_THRESHOLD
            )
            self.session.add(rules)
            await self.session.commit()
            await self.session.refresh(rules)
        return rules

    async def update_rules(self, new_rules: dict):
        current_rules = await self.get_rules()
        for key, value in new_rules.items():
            setattr(current_rules, key, value)
        self.session.add(current_rules)
        await self.session.commit()
        await self.session.refresh(current_rules)
        return current_rules
