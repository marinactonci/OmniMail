import UseThreads from "@/hooks/use-threads";
import { trpc } from "@/server/client";
import React, { JSX, useState } from "react";
import Avatar from "react-avatar";
import Select from "react-select";

// Define a type for the suggestion object to improve type safety
type Suggestion = {
  name: string | null;
  address: string;
};

// Define a type for the option object used in react-select
type SelectOption = {
  label: JSX.Element;
  value: Suggestion | string; // Value can be a Suggestion object or a string (for new input)
};

type TagInputProps = {
  placeholder: string;
  label: string;
  onChange: (values: SelectOption[]) => void;
  value: SelectOption[];
};

const TagInput: React.FC<TagInputProps> = ({ label, onChange, value }) => {
  const [input, setInput] = useState("");

  const { accountId } = UseThreads();

  const { data: suggestions } = trpc.account.getSuggestions.useQuery({
    accountId,
  });

  // Map suggestions to SelectOption objects
  const options: SelectOption[] | undefined = suggestions?.map((suggestion) => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar
          name={suggestion.name ? suggestion.name : undefined}
          size="25"
          textSizeRatio={2}
          round={true}
        />
        {suggestion.address}
      </span>
    ),
    value: suggestion, // Value is a Suggestion object
  }));

  // Create a new option for the current input
  const createInputOption = (inputValue: string): SelectOption => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar
          name={inputValue}
          size="25"
          textSizeRatio={2}
          round={true}
        />
        {inputValue}
      </span>
    ),
    value: inputValue, // Value is the input string
  });

  return (
    <div className="border rounded-md flex items-center">
      <span className="mx-3 text-sm text-gray-500">{label}</span>
      <Select
        value={value}
        onChange={() => onChange}
        className="w-full flex-1"
        isMulti
        onInputChange={setInput}
        placeholder={""}
        options={
          input && options
            ? [...options, createInputOption(input)] // Use spread syntax for cleaner concatenation
            : input
            ? [createInputOption(input)] // Only display the input option if no suggestions
            : options
        }
        classNames={{
          control: () => {
            return "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent";
          },
          multiValue: () => {
            return "dark:!bg-gray-700";
          },
          multiValueLabel: () => {
            return "dark:text-white dark:bg-gray-700 rounded-md";
          },
        }}
        classNamePrefix="select"
      />
    </div>
  );
};

export default TagInput;
