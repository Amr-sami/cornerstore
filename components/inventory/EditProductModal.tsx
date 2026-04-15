"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { updateProduct } from "@/lib/firestore";
import type { Product } from "@/lib/types";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export function EditProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(product?.quantity ?? 0);
  const [price, setPrice] = useState(product?.price ?? 0);
  const [costPrice, setCostPrice] = useState(product?.costPrice ?? 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product?.lowStockThreshold ?? 3
  );

  const handleSave = async () => {
    if (!product) return;
    setLoading(true);
    try {
      await updateProduct(product.id, {
        quantity,
        price,
        costPrice: costPrice || undefined,
        lowStockThreshold,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تعديل المنتج">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-text-secondary">{product.brand}</p>
        </div>

        <Input
          label="الكمية"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={0}
        />

        <Input
          label="سعر البيع (جنيه)"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={0}
        />

        <Input
          label="سعر الشراء (جنيه)"
          type="number"
          value={costPrice}
          onChange={(e) => setCostPrice(Number(e.target.value))}
          min={0}
        />

        <Input
          label="حد التنبيه عند انخفاض الكمية"
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(Number(e.target.value))}
          min={1}
        />

        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            إلغاء
          </Button>
          <Button onClick={handleSave} loading={loading} className="flex-1">
            حفظ
          </Button>
        </div>
      </div>
    </Modal>
  );
}