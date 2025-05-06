import React from "react";

export type Suggestion = {
    name: string | null;
    address: string;
};

export type SelectOption = {
    label: React.JSX.Element;
    value: string | Suggestion; // Value can be a Suggestion object or a string
};