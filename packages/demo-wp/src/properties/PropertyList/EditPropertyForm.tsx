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

import { useEffect, useState } from 'react';
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
  value?: string;
  id: keyof tFormData;
  placeholder?: string;
  register: UseFormRegister<tFormData>;
  errors: FieldErrors<FieldValues>;
};

// function Input({ value, id, placeholder, register, errors }: tInputProps) {
function Input({ id, placeholder, register, errors }: tInputProps) {
  return (
    <input
      type="text"
      // value={value}
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
  value: '',
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
  const propertyKey = useBoundStore((state) => state.currentProperty);
  const setCurrProp = useBoundStore((state) => state.setCurrentProperty);
  const setProperties = useBoundStore((state) => state.setProperties);
  const setChangesMade = usePropertySelect((state) => state.setChangesMade);
  const defaultProperty = useBoundStore((state) => state.defaultProperty);
  const setDefaultProperty = useBoundStore((state) => state.setDefaultProperty);

  const property = propertyKey
    ? properties.get(propertyKey) ?? defaultProperty
    : defaultProperty;

  const defaultValues = {
    addressLine1: property.addressLine1,
    addressLine2: property.addressLine2,
    addressLine3: property.addressLine3,
    postcode: property.postcode,
    region: property.region,
    authority: property.authority,
    dateAdded: new Date(),
    latlong: [0, 0],
  } as tFormData;

  const setShowEditPropertyForm = usePropertySelect(
    (state) => state.setShowEditPropertyForm
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<tFormData>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [property]);

  const onSubmit: SubmitHandler<tFormData> = (data) => {
    let newPropertyKey = propertyKey;
    if (!newPropertyKey) {
      newPropertyKey = `${data.addressLine1}-${data.addressLine2}`;
    }

    property.addressLine1 = data.addressLine1;
    property.addressLine2 = data.addressLine2;
    property.addressLine3 = data.addressLine3;
    property.region = data.region;
    property.postcode = data.postcode;
    property.authority = 'unknown';

    properties.set(newPropertyKey, { ...property });
    setProperties(properties);

    setCurrProp(newPropertyKey);
    setShowEditPropertyForm(false);
    // setChangesMade(false);
    setTimeout(() => {
      reset();
    }, 1000);
  };

  // const deleteProperty = () => {
  //   if (!propertySelected) return;
  //   properties.delete(propertySelected);
  // };

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
              // value={property.addressLine1}
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
              value={property.addressLine2}
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
              value={property.addressLine3}
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
              value={property.region}
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
              value={property.postcode}
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
