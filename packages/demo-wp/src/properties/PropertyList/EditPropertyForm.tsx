/* eslint-disable react/jsx-props-no-spreading */
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useState } from 'react';
import { useBoundStore, usePropertySelect } from '../Model/NewModel';
import { cn } from '../../Utils/CSS';

const formSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  region: z.string(),
  postcode: z.string(),
  authority: z.string().optional(),
  latlong: z.tuple([z.number(), z.number()]).optional(),
  dateAdded: z.date().optional(),
});

type tFormData = z.infer<typeof formSchema>;

/* eslint-disable jsx-a11y/label-has-associated-control */
type tInputProps = {
  value: string;
  id: keyof tFormData;
  placeholder?: string;
  register: UseFormRegister<tFormData>;
  errors: FieldErrors<FieldValues>;
};

function Input({ value, id, placeholder, register, errors }: tInputProps) {
  return (
    <input
      type="text"
      value={value}
      id={id}
      placeholder={placeholder}
      className="input input-sm w-full max-w-xs border-0 focus:outline-none focus:ring-0"
      {...register(id, {
        required: 'This is required!',
        minLength: 1,
      })}
      name={id}
      aria-invalid={errors[id] ? 'true' : 'false'}
    />
  );
}

Input.defaultProps = {
  placeholder: 'Enter Value',
};

type tGridRowProps = {
  children: React.ReactNode;
};

function GridRow({ children }: tGridRowProps) {
  return (
    <div className="hover:cursor-pointer">
      <div className="grid grid-cols-3 gap-y-1">{children}</div>
      <div className="divider m-0 h-1" />
    </div>
  );
}

function ErrorMessage({
  errors,
  id,
}: {
  errors: FieldErrors<FieldValues>;
  id: string;
}) {
  if (!errors[id]) return null;

  return (
    <span className="pl-3 text-sm text-red-700">
      {errors[id]?.message as string}
    </span>
  );
}

function EditPropertyForm() {
  const [requestConfirm] = useState<boolean>(false);
  const properties = useBoundStore((state) => state.properties);
  const setProperties = useBoundStore((state) => state.setProperties);
  const propertySelected = useBoundStore((state) => state.currentProperty);
  const currentProperty = propertySelected
    ? properties.get(propertySelected) ?? null
    : null;

  const setShowEditPropertyForm = usePropertySelect(
    (state) => state.setShowEditPropertyForm
  );

  const selectedProperty = propertySelected
    ? properties.get(propertySelected)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<tFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<tFormData> = (data) => {
    if (!currentProperty || !propertySelected) return;

    currentProperty.addressLine1 = data.addressLine1;
    currentProperty.addressLine2 = data.addressLine2;
    currentProperty.addressLine3 = data.addressLine3;
    currentProperty.region = data.region;
    currentProperty.postcode = data.postcode;
    currentProperty.authority = 'unknown';

    properties.set(propertySelected, currentProperty);
    setProperties(properties);
  };

  const deleteProperty = () => {
    if (!propertySelected) return;
    properties.delete(propertySelected);
  };

  if (!selectedProperty) {
    return <div>no property!</div>;
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid text-xs md:text-sm">
        <div className="divider m-0 h-1" />
        <GridRow>
          <div className="flex h-full items-center">
            <label
              htmlFor="name_number"
              className="items-center hover:cursor-pointer"
            >
              Name / No.
            </label>
          </div>
          <div className="col-span-2">
            <Input
              value={selectedProperty.addressLine1}
              id="addressLine1"
              placeholder="Enter property name / number"
              register={register}
              errors={errors}
            />
            <ErrorMessage errors={errors} id="name_number" />
          </div>
        </GridRow>
        <GridRow>
          <div className="flex h-full items-center">
            <label htmlFor="street" className="items-center">
              Street
            </label>
          </div>
          <div className="col-span-2">
            <Input
              value={selectedProperty.addressLine2}
              id="addressLine2"
              placeholder="Enter street"
              register={register}
              errors={errors}
            />
            <ErrorMessage errors={errors} id="street" />
          </div>
        </GridRow>
        <GridRow>
          <div className="flex h-full items-center">
            <label htmlFor="town" className="items-center">
              Town
            </label>
          </div>
          <div className="col-span-2">
            <Input
              value={selectedProperty.addressLine3}
              id="addressLine3"
              placeholder="Enter town"
              register={register}
              errors={errors}
            />
          </div>
        </GridRow>
        <GridRow>
          <div className="flex h-full items-center">
            <label htmlFor="region" className="items-center">
              Region
            </label>
          </div>
          <div className="col-span-2">
            <Input
              value={selectedProperty.region}
              id="region"
              placeholder="Enter region"
              register={register}
              errors={errors}
            />
          </div>
        </GridRow>
        <GridRow>
          <div className="flex h-full items-center">
            <label htmlFor="postcode" className="items-center">
              Postcode
            </label>
          </div>
          <div className="col-span-2">
            <Input
              value={selectedProperty.postcode}
              id="postcode"
              placeholder="Enter postcode"
              register={register}
              errors={errors}
            />
          </div>
        </GridRow>
      </div>
      <div
        className={cn('flex justify-end gap-2', {
          hidden: requestConfirm === true,
        })}
      >
        <button
          type="submit"
          className="btn btn-sm"
          onClick={() => setShowEditPropertyForm(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-sm"
          onClick={() => setShowEditPropertyForm(false)}
        >
          Update
        </button>
      </div>
    </form>
  );
}

export default EditPropertyForm;
