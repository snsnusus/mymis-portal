import type { ReactElement } from 'react';

import type {
  SubmitHandler,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form';

import { FormProvider as RhfFormProvider } from 'react-hook-form';

export interface FormProps<Type extends FieldValues>
  extends UseFormReturn<Type>,
    PropsWithChildren {
  onSubmit?: SubmitHandler<Type>;
}

export const FormProvider = <Type extends object>(
  props: FormProps<Type>
): ReactElement => {
  const { onSubmit = () => {}, children, ...methods } = props;

  return (
    <RhfFormProvider<Type> {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </RhfFormProvider>
  );
};
