import pandas as pd
from sqlalchemy.orm import Session
from ai_remora.models import SKU

class SKUTracker:

    def __init__(self, db: Session):
        self.db = db

    def get_all_skus(self):
        return self.db.query(SKU).all()

    def analyze(self):
        skus = self.get_all_skus()

        data = [{
            "sku_id": s.sku_id,
            "name": s.name,
            "category": s.category,
            "stock": s.stock,
            "price": s.price,
            "daily_sales": s.daily_sales,
            "supplier_lead_time": s.supplier_lead_time
        } for s in skus]

        df = pd.DataFrame(data)

        if df.empty:
            return df

        df["reorder_flag"] = df["stock"] < (df["daily_sales"] * df["supplier_lead_time"])
        df["revenue_per_day"] = df["daily_sales"] * df["price"]
        df["overstock_flag"] = df["stock"] > (df["daily_sales"] * 30)

        return df
