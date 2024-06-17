import React from "react";

const ButtonProps = {
    id: number,
    text: string,
    link: string,
    type: string
}

function SliderButtons({ buttons: ButtonProps }) {
    return buttons.map(({ id, link, text }) => (
        <a target="_blank" key={id} href={link}>
            <span>{text}</span>
        </a>
    ));
};

export default SliderButtons;
