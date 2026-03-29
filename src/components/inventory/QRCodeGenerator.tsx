"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  itemId: string;
  itemName: string;
}

export function QRCodeGenerator({ itemId, itemName }: QRCodeGeneratorProps) {
  const [quantity, setQuantity] = useState(1);
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = () => {
    setShowQR(true);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-${itemId}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Gerar QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="itemId">ID do Item</Label>
            <Input id="itemId" value={itemId} readOnly />
          </div>
          <div>
            <Label htmlFor="itemName">Nome do Item</Label>
            <Input id="itemName" value={itemName} readOnly />
          </div>
        </div>
        
        <div>
          <Label htmlFor="quantity">Quantidade de Etiquetas</Label>
          <Input 
            id="quantity" 
            type="number" 
            min="1" 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>

        <Button onClick={generateQRCode} className="w-full">
          Gerar QR Code
        </Button>

        {showQR && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: quantity }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <QRCodeSVG 
                      value={`ITEM:${itemId}:${Date.now()}:${index}`}
                      size={100}
                      level="H"
                      includeMargin={true}
                    />
                    <p className="text-xs mt-2 text-center">Etiqueta {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={downloadQRCode} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Baixar Todos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}