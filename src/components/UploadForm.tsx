'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FabricUnit } from './FileUpload';
import { useState } from 'react';

type Props = {
  onFileUpload: (pdfFile: File) => void;
  onSubmitFile: (
    file: File,
    fabricWidth: number,
    fabricUnit: FabricUnit,
  ) => void;
  onReset: () => void;
  children: React.ReactNode;
};

export const uploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.length == 1, 'File is required.')
    .refine(
      (file) => file && file[0]?.type === 'application/pdf',
      'File must be a PDF.',
    ),

  width: z
    .string({ required_error: 'Width is required.' })
    .transform((val) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        return 'Width must be a number.';
      }
      return parsed;
    })
    .refine((val) => Number.isInteger(val), {
      message: 'Width must be an integer.',
    })
    .refine((val) => (val as number) >= 0, {
      message: 'Width must be a positive integer.',
    }),
  unit: z.enum(['inch', 'cm'], {
    required_error: 'Select a unit.',
  }),
});

export function UploadForm({
  onFileUpload,
  onSubmitFile,
  onReset,
  children,
}: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    mode: 'onChange',
    defaultValues: {
      file: undefined,
      width: undefined,
      unit: undefined,
    },
  });

  const fileRef = form.register('file', {
    required: true,
    onChange: (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        onFileUpload(file);
      }
    },
  });

  const clearInput = () => {
    onReset();
    form.reset({ file: null, width: '0', unit: 'inch' }); // Changed '0' to 0 to match the expected number type
    setSubmitted(false);
  };

  const onSubmit = (data: z.infer<typeof uploadSchema>) => {
    //Save the file to the server so it can be sent to the backend
    const pdfFile = data.file[0];
    onSubmitFile(pdfFile, data.width, data.unit);
    setSubmitted(true);

    //Submit the form

    console.log(data);
  };

  //   <Label htmlFor="pdf">PDF:</Label>
  //         <Input
  //           disabled={loading}
  //           ref={inputRef}
  //           id="pdf"
  //           type="file"
  //           accept=".pdf"
  //           onChange={onFileUpload}
  //         />

  //         {pdf && (
  //           <>
  //             <Label htmlFor="size">Fabric width:</Label>
  //             <div className="flex gap-2">
  //               {/* TODO: figure out a better number input */}
  //               <Input
  //                 id="size"
  //                 disabled={loading || pdf === ''}
  //                 type="number"
  //                 value={fabricWidth}
  //                 onChange={(e) => {
  //                   e.target.value
  //                     ? setFabricWidth(Number(e.target.value))
  //                     : setFabricWidth(undefined);
  //                 }}
  //               />
  //               <Select
  //                 disabled={loading || pdf === ''}
  //                 value={fabricUnit}
  //                 onValueChange={(value: FabricUnit) => setFabricUnit(value)}
  //               >
  //                 <SelectTrigger className="w-[280px]">
  //                   <SelectValue
  //                     className="text-muted-foreground"
  //                     placeholder="Unit"
  //                   />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="inch">inches (in)</SelectItem>
  //                   <SelectItem value="cm">centimeters (cm)</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </>
  //         )}

  return (
    <Form {...form}>
      {/* <div className="grid w-full max-w-2xl items-center gap-1.5 pb-1.5"></div> */}
      <form className="space-y-2 pb-1.5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="file"
          render={({}) => (
            <FormItem>
              <FormLabel>PDF</FormLabel>
              <FormControl>
                <Input type="file" accept="application/pdf" {...fileRef} />
              </FormControl>
              <FormDescription>
                Please upload a PDF of your pattern.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fabric width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Please enter the width of your fabric and the corresponding
                  unit.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select A Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="inch">inches (in)</SelectItem>
                    <SelectItem value="cm">centimeters (cm)</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>{children}</div>
        <div className={'flex justify-center pt-10'}>
          {submitted ? (
            <Button onClick={clearInput}>Clear</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </Form>
  );
}
