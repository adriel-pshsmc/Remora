from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class SKU(Base):
    __tablename__ = "skus"

    id = Column(Integer, primary_key=True, index=True)
    sku_id = Column(String, unique=True, index=True)
    name = Column(String)
    category = Column(String)
    stock = Column(Integer)
    price = Column(Float)
    daily_sales = Column(Float)
    supplier_lead_time = Column(Integer)
