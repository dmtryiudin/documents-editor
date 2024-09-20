import { useBoolean } from "@chakra-ui/react";

export function useServerActionClientRequest<T>(
  callback: (props: T) => Promise<any>
) {
  const [isLoading, { on }] = useBoolean();

  const wrappedCallback = async (props: T) => {
    on();
    await callback(props);
  };

  return { isLoading, wrappedCallback };
}
