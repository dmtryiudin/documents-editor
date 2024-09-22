import { useBoolean } from "@chakra-ui/react";

export function useServerActionClientRequest<T>(
  callback: (props: T) => Promise<any>
) {
  const [isLoading, { on, off }] = useBoolean();

  const wrappedCallback = async (props: T) => {
    on();
    await callback(props);
    off();
  };

  return { isLoading, wrappedCallback };
}
