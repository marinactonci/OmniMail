import React, { useState } from 'react';
import Avatar from 'react-avatar';
import Select from 'react-select';
import { SelectOption } from '@/types/select-option';

type TagInputProps = {
    suggestions: string[];
    defaultValues?: SelectOption[];
    placeholder: string;
    label: string;

    onChange: (values: SelectOption[]) => void;
    value: SelectOption[];
};

const TagInput: React.FC<TagInputProps> = ({ suggestions, defaultValues = [], label, onChange, value }) => {
    const [input, setInput] = useState('');

    const options = suggestions.map(suggestion => ({
        label: (
            <span className='flex items-center gap-2'>
                <Avatar name={suggestion} size='25' textSizeRatio={2} round={true} />
                {suggestion}
            </span>
        ), value: suggestion
    }));

    return <div className="border dark:border-white/20 rounded-md flex items-center">
        <span className='mx-3 text-sm text-gray-500'>{label}</span>
        <Select
            value={value}
            // @ts-expect-error This is a workaround for the type error
            onChange={onChange}
            className='w-full flex-1 dark:!bg-accent'
            isMulti
            onInputChange={setInput}
            defaultValue={defaultValues}
            placeholder={''}
            options={input ? options.concat({
                label: (
                    <span className='flex items-center gap-2'>
                        <Avatar name={input} size='25' textSizeRatio={2} round={true} />
                        {input}
                    </span>
                ), value: input
            }) : options}
            classNames={{
                control: () => {
                    return '!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:!bg-accent'
                },
                input: () => {
                    return "dark:!text-white"
                },
                multiValue: () => {
                    return 'dark:!bg-gray-700'
                },
                multiValueLabel: () => {
                    return 'dark:!text-white dark:bg-background'
                },
                menu: () => {
                    return 'dark:!bg-accent'
                },
                option: (state) => {
                    return state.isFocused ? 'dark:!bg-gray-700' : 'dark:!bg-accent dark:hover:!bg-gray-700';
                }
            }}
            classNamePrefix="select"
        />
    </div>
};

export default TagInput;