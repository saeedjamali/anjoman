
import { useState } from 'react'
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
// const company = [
//     { id: 1, name: 'Tom Cook' },
//     { id: 2, name: 'Wade Cooper' },
//     { id: 3, name: 'Tanya Fox' },
//     { id: 4, name: 'Arlene Mccoy' },
//     { id: 5, name: 'Devon Webb' },
// ]

export default function ComboSearch({ companies, selected, setSelected, setShowDetail }) {
    const [touched, setTouched] = useState(false);

    return (
        <Autocomplete
            labelPlacement={"outside"}
            disabled
            isRequired
            color='default'
            // allowsCustomValue
            label="جستجو در شرکت ها"
            // variant="bordered"
            className="max-w-xs"
            aria-colcount={companies.length}
            // placeholder={companies.length == 0 ? "شرکتی یافت نشد" : ""}
            defaultItems={companies}
            selectedKey={selected}
            onSelectionChange={(key) => {
                setSelected(key)
                setShowDetail(true)
            }}
            onClose={() => setTouched(true)}
        >
            {(item) => <AutocompleteItem key={item.code}>{item.name}</AutocompleteItem>}
        </Autocomplete>
    );
}

