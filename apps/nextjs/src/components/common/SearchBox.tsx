import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
interface SearchBoxProps {
  placeholder: string;
  onEnter?: (arg: string) => void;
  onSearch?: (arg: string) => void;
  width?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder,
  onEnter,
  onSearch,
  width
}) => {
  const [searchedText, setSearchedText] = useState<string>("");
  const handleKeyPress = (keyCode: string) => {
    if (keyCode == "Enter") {
      onEnter?.(searchedText);
    }
  };

  return (
    <InputGroup width={width}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.500" />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={searchedText}
        onChange={(event) => {
          setSearchedText(event.target.value);
          onSearch?.(event.target.value);
        }}
        onKeyPress={(event) => handleKeyPress(event.code)}
        backgroundColor={"white"}
        variant={"outline"}
      />
    </InputGroup>
  );
};

const defaultProps: Partial<SearchBoxProps> = {
  onEnter: (_) => {},
  onSearch: (_) => {},
  width: "256px"
};

SearchBox.defaultProps = defaultProps;
