import { useBoolean } from "@chakra-ui/react";

export function useServerActionClientRequest<T>(
  callback: (props: T) => Promise<any>,
  defaultLoading = false
) {
  const [isLoading, { on, off }] = useBoolean(defaultLoading);

  const wrappedCallback = async (props: T) => {
    on();
    await callback(props);
    off();
  };

  return { isLoading, wrappedCallback };
}
