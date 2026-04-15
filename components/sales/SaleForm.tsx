"use client";

import { useState, useEffect } from "react";
import { ProductSearchSelect } from "./ProductSearchSelect";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { recordSale } from "@/lib/firestore";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface SaleFormProps {
  onSuccess: () => void;
  preselectedProduct?: Product | null;
}

export function SaleForm({ onSuccess, preselectedProduct }: SaleFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(preselectedProduct || null);
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setPricePerUnit(selectedProduct.price);
    }
  }, [selectedProduct]);

  const totalPrice = quantity * pricePerUnit;

  const handleSubmit = async () => {
    if (!selectedProduct || quantity < 1 || pricePerUnit < 1) return;
    setLoading(true);
    try {
      await recordSale(selectedProduct.id, quantity, pricePerUnit, note || undefined);
      setSelectedProduct(null);
      setQuantity(1);
      setPricePerUnit(0);
      setNote("");
      onSuccess();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isValid = selectedProduct && quantity >= 1 && pricePerUnit > 0 && quantity <= selectedProduct.quantity;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
      <h3 className="font-semibold mb-4">تسجيل بيع جديد</h3>

      <div className="space-y-4">
        <ProductSearchSelect value={selectedProduct} onChange={setSelectedProduct} />

        {selectedProduct && (
          <>
            <p className="text-sm text-text-secondary">
              المتوفر في المخزن: {selectedProduct.quantity} قطعة
            </p>

            <Input
              label="الكمية"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              max={selectedProduct.quantity}
              error={
                quantity > selectedProduct.quantity
                  ? `الحد الأقصى: ${selectedProduct.quantity}`
                  : undefined
              }
            />

            <Input
              label="سعر الوحدة (جنيه)"
              type="number"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(Number(e.target.value))}
              min={1}
            />

            <div className="p-4 bg-accent-light rounded-lg">
              <p className="text-sm text-text-secondary">الإجمالي</p>
              <p className="text-2xl font-bold text-accent">
                {formatPrice(totalPrice)}
              </p>
            </div>

            <Input
              label="ملاحظة (اختياري)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ملاحظة..."
            />

            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              loading={loading}
              className="w-full"
            >
              تسجيل البيع
            </Button>
          </>
        )}
      </div>
    </div>
  );
}