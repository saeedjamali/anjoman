
import { useState } from 'react'
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";


export default function AutoCompleteYear({ setSelectedYear, selectedYear, setFilterUnits, units, setSelectedUnit ,year}) {
    const [query, setQuery] = useState('')

    return (

        <>
            <Autocomplete
                backdrop="blur"
                isRequired
                allowsCustomValue
                label="سال تحصیلی"
                variant="bordered"
                className="max-w-xs"
                defaultItems={year}
                selectedKey={selectedYear}
                onSelectionChange={(key) => {
                    setSelectedYear(key);
                    setFilterUnits(units.filter((item) => item.year == key));
                    setSelectedUnit([]);
                }}
            >
                {(item) => (
                    <AutocompleteItem key={item.name}>
                        {item.name}
                    </AutocompleteItem>
                )}
            </Autocomplete>

        </>
    );
}

