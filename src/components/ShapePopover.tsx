import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PopoverClose, PopoverContent } from '@/components/ui/popover';
import { X } from 'lucide-react';
import { FoldLocation, Path } from '@/components/EditSVGPage';
import { SetStateAction } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

type Props = {
  shapeDetails: Path;
  setShapeMap: React.Dispatch<SetStateAction<Map<string, Path>>>;
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

  const onFoldLocationChange = (value: string) => {
    const newShapeDetails = {
      ...shapeDetails,
      foldLocation: value as FoldLocation,
    };
    setShapeMap((prev) => new Map(prev.set(id, newShapeDetails)));
  };

  return (
    <PopoverContent className="relative w-96">
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
          <div className="grid grid-cols-3 h-[28px] items-center gap-4">
            <Label htmlFor="placeOnFold">Place on fold</Label>
            <div className="col-span-2 items-center flex gap-4">
              <Switch
                id="placeOnFold"
                onCheckedChange={onPlaceOnFoldChange}
                defaultChecked={shapeDetails?.placeOnFold}
              />
              {shapeDetails?.placeOnFold && (
                <RadioGroup
                  className="flex"
                  onValueChange={onFoldLocationChange}
                  defaultValue={shapeDetails?.foldLocation}
                >
                  <div>
                    <RadioGroupItem
                      value="top"
                      id="top"
                      className="peer sr-only"
                    >
                      Top
                    </RadioGroupItem>
                    <Label
                      htmlFor="top"
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-up-to-line"
                      >
                        <path d="M5 3h14" />
                        <path d="m18 13-6-6-6 6" />
                        <path d="M12 7v14" />
                      </svg>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="left"
                      id="left"
                      className="peer sr-only"
                    >
                      Left
                    </RadioGroupItem>
                    <Label
                      htmlFor="left"
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-left-to-line"
                      >
                        <path d="M3 19V5" />
                        <path d="m13 6-6 6 6 6" />
                        <path d="M7 12h14" />
                      </svg>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="right"
                      id="right"
                      className="peer sr-only"
                    >
                      Right
                    </RadioGroupItem>
                    <Label
                      htmlFor="right"
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-right-to-line"
                      >
                        <path d="M17 12H3" />
                        <path d="m11 18 6-6-6-6" />
                        <path d="M21 5v14" />
                      </svg>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="bottom"
                      id="bottom"
                      className="peer sr-only"
                    >
                      Bottom
                    </RadioGroupItem>
                    <Label
                      htmlFor="bottom"
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-down-to-line"
                      >
                        <path d="M12 17V3" />
                        <path d="m6 11 6 6 6-6" />
                        <path d="M19 21H5" />
                      </svg>
                    </Label>
                  </div>
                </RadioGroup>
              )}
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  );
}
