import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { z } from "zod";

export function useFormValidation<FieldsType>(
  fields: FieldsType,
  zodRules: z.ZodObject<any>
) {
  const [formFields, setFormFields] = useState<FieldsType>(fields);
  const [formErrors, setFormErrors] = useState<FieldsType>(fields);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitHandler = (
    callback: (fields: FieldsType) => any | Promise<any>
  ) => {
    const returnFn: FormEventHandler<HTMLDivElement> = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      const validationResult = zodRules.safeParse(formFields);

      if (!validationResult.success) {
        validationResult.error.errors.map((el) => {
          setFormErrors((prev) => ({
            ...prev,
            [el.path[0] as keyof FieldsType]: el.message,
          }));
        });
        setIsSubmitting(false);
        return;
      }

      await callback(formFields);

      setIsSubmitting(false);
    };

    return returnFn;
  };

  const registerField = (key: keyof FieldsType) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setFormFields((prev) => ({ ...prev, [key]: e.target.value }));
      setFormErrors((prev) => ({ ...prev, [key]: "" }));
    };

    return { onChange, value: formFields[key] };
  };

  return { submitHandler, registerField, formErrors, isSubmitting };
}
