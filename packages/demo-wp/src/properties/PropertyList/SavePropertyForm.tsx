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
  propertyID: z.string(),
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

function SavePropertyForm() {
  const [requestConfirm] = useState<boolean>(false);
  const properties = useBoundStore((state) => state.properties);
  const propertyKey = useBoundStore((state) => state.currentProperty);
  const setCurrProp = useBoundStore((state) => state.setCurrentProperty);
  const setProperties = useBoundStore((state) => state.setProperties);
  const setChangesMade = usePropertySelect((state) => state.setChangesMade);
  const defaultProperty = useBoundStore((state) => state.defaultProperty);
  const showSavePropertyForm = usePropertySelect(
    (state) => state.showSavePropertyForm
  );

  // const setDefaultProperty = useBoundStore((state) => state.setDefaultProperty);

  // const property = propertyKey
  //   ? properties.get(propertyKey) ?? defaultProperty
  //   : defaultProperty;

  const property = defaultProperty;

  // console.log('property key in save form: ', propertyKey, property);

  const defaultValues = {
    propertyID: propertyKey,
  } as tFormData;

  const setShowSavePropertyForm = usePropertySelect(
    (state) => state.setShowSavePropertyForm
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
    if (showSavePropertyForm) {
      reset(defaultValues);
    }
  }, [showSavePropertyForm]);

  const onSubmit: SubmitHandler<tFormData> = (data) => {
    const newPropertyKey = data.propertyID;

    properties.set(newPropertyKey, { ...property });
    setProperties(new Map(properties));
    setCurrProp(newPropertyKey);
    setShowSavePropertyForm(false);
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
              Save As:
            </label>
          </div>
          <div className="col-span-2">
            <Input
              // value={property.addressLine1}
              id="propertyID"
              placeholder="Enter property save name"
              register={register}
              errors={errors}
            />
            <ErrorMessage errors={errors} id="propertyID" />
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
          onClick={() => setShowSavePropertyForm(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-sm"
          onClick={() => setShowSavePropertyForm(false)}
        >
          Update
        </button>
      </div>
    </form>
  );
}

export default SavePropertyForm;
