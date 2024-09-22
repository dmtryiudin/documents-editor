"use client";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { FC, useState } from "react";

export const HidePasswordInput: FC<InputProps> = ({ ...rest }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup>
      <Input {...rest} pr="3.5rem" type={show ? "text" : "password"} />
      <InputRightElement width="3.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? <ViewOffIcon /> : <ViewIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
