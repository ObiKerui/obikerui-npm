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
import dayjs from 'dayjs';

import { tProperty, useBoundStore, usePropertySelect } from '../Model/NewModel';

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
  id: keyof tFormData;
  placeholder?: string;
  register: UseFormRegister<tFormData>;
  errors: FieldErrors<FieldValues>;
};

function Input({ id, placeholder, register, errors }: tInputProps) {
  return (
    <input
      type="text"
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

// type tLabelProps = {
//   id: string;
//   children: React.ReactNode;
// };

// function Label({ id, children }: tLabelProps) {
//   return (
//     <label
//       htmlFor={id}
//       className="form-control flex w-full max-w-xs items-center justify-center"
//     >
//       {children}
//     </label>
//   );
// }

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

function NewPropertyForm() {
  const properties = useBoundStore((state) => state.properties);
  const setChangesMade = usePropertySelect((state) => state.setChangesMade);
  const setCurrProp = useBoundStore((state) => state.setCurrentProperty);
  const setProperties = useBoundStore((state) => state.setProperties);
  const setShowNewPropertyForm = usePropertySelect(
    (state) => state.setShowNewPropertyForm
  );
  const defaultProp = useBoundStore((state) => state.defaultProperty);
  // const property = (currProp ? properties.get(currProp) : null) ?? null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<tFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<tFormData> = (data) => {
    const propertyKey = `${data.addressLine1}-${data.addressLine2}`;
    let propExisting = properties.get(propertyKey);

    if (!propExisting) {
      propExisting = { ...defaultProp };
    }

    let updatedProperty = { ...propExisting } as tProperty;

    if (propExisting) {
      updatedProperty = propExisting;
    }

    updatedProperty.addressLine1 = data.addressLine1;
    updatedProperty.addressLine2 = data.addressLine2;
    updatedProperty.addressLine3 = data.addressLine3;
    updatedProperty.region = data.region;
    updatedProperty.postcode = data.postcode;
    updatedProperty.authority = 'unknown';
    updatedProperty.dateAdded = dayjs().format('YYYY-MM-DD');

    properties.set(propertyKey, updatedProperty);
    setProperties(properties);
    console.log('set current property to key: ', propertyKey);
    setCurrProp(propertyKey);
    setShowNewPropertyForm(false);
    // setChangesMade(false);
    setTimeout(() => {
      reset();
    }, 1000);
  };

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
              id="postcode"
              placeholder="Enter postcode"
              register={register}
              errors={errors}
            />
          </div>
        </GridRow>
      </div>
      <div className="flex justify-end gap-2">
        <button type="submit" className="btn btn-sm" onClick={() => reset()}>
          Reset
        </button>
        <button type="submit" className="btn btn-sm">
          Save
        </button>
      </div>
    </form>
  );
}

//   return (
//   );
// }

// function Property() {
//   const { register, handleSubmit } = useForm();

//   return (
//     <div className="flex flex-col gap-2">
//       <GridPropertyForm register={register} />
//       <FormControls onSubmit={handleSubmit} />
//     </div>
//   );
// }

// function LeftOver() {
//   return (
//     <div className="grid grid-cols-3 gap-y-1 divide-y pb-4">
//       <div className="flex h-full items-center border-t">
//         <label htmlFor="name_number" className="items-center">
//           Name / No.
//         </label>
//       </div>
//       <div className="col-span-2">
//         <Input id="name_number" />
//       </div>

//       <div className="flex h-full items-center">
//         <label htmlFor="street" className="items-center">
//           Street
//         </label>
//       </div>
//       <div className="col-span-2">
//         <Input id="street" />
//       </div>
//       <div className="flex h-full items-center">
//         <label htmlFor="town" className="items-center">
//           Town
//         </label>
//       </div>
//       <div className="col-span-2">
//         <Input id="town" />
//       </div>
//       <div className="flex h-full items-center">
//         <label htmlFor="town" className="items-center">
//           Postcode
//         </label>
//       </div>
//       <div className="col-span-2">
//         <Input id="postcode" />
//       </div>
//     </div>
//   );
// }

export default NewPropertyForm;
