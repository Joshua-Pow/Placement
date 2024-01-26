import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PopoverClose, PopoverContent } from '@/components/ui/popover';
import { X } from 'lucide-react';
import { Paths } from '@/components/EditSVGPage';
import { SetStateAction } from 'react';

type Props = {
  shapeDetails: Paths;
  setShapeMap: React.Dispatch<SetStateAction<Map<string, Paths>>>;
  id: string;
};

export function ShapePopover({ shapeDetails, setShapeMap, id }: Props) {
  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newShapeDetails = {
      ...shapeDetails,
      quantity: parseInt(e.target.value),
    };
    setShapeMap((prev) => new Map(prev.set(id, newShapeDetails)));
  };

  const onRotatableChange = (e: boolean) => {
    const newShapeDetails = {
      ...shapeDetails,
      canRotate: e === true,
    };
    setShapeMap((prev) => new Map(prev.set(id, newShapeDetails)));
  };

  const onPlaceOnFoldChange = (e: boolean) => {
    const newShapeDetails = {
      ...shapeDetails,
      placeOnFold: e === true,
    };
    setShapeMap((prev) => new Map(prev.set(id, newShapeDetails)));
  };

  return (
    <PopoverContent className="relative w-80">
      <PopoverClose className="absolute right-2 top-2">
        <X onClick={() => console.log('end')} />
      </PopoverClose>
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              defaultValue={shapeDetails?.quantity.toString()}
              onChange={onQuantityChange}
              className="col-span-2 h-8"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="rotatable">Rotatable</Label>
            <Switch
              id="rotatable"
              onCheckedChange={onRotatableChange}
              defaultChecked={shapeDetails?.canRotate}
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="placeOnFold">Place on fold</Label>
            <Switch
              id="placeOnFold"
              onCheckedChange={onPlaceOnFoldChange}
              defaultChecked={shapeDetails?.placeOnFold}
            />
          </div>
        </div>
      </div>
    </PopoverContent>
  );
}
