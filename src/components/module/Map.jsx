
"use client"

import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet';
import L from "leaflet";

function Map({ setLng, setLat, lat, lng, setAddress }) {


    var container = L.DomUtil.get("map");
    if (container != null) {
        container._leaflet_id = null;
    }

    // key={new Date().getTime()}
    const mapCenter = [lat, lng];
    return (
        <div className='w-full h-64 rounded-md'>
            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{
                height: "100%", width: "100%", borderRadius: "8px", zIndex:
                    1
            }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <DetectClick /> */}
                <LocationMarker setLat={setLat} setLng={setLng} setAddress={setAddress} />
                <ChangeCenter position={mapCenter} />
                <Marker position={mapCenter} icon={new Icon({ iconUrl: '/images/icon96.png', iconSize: [25, 41], iconAnchor: [12, 41] })} >
                    <Popup >
                        اینجا مدرسه شماست
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default Map


function LocationMarker({ setLng, setLat, setAddress }) {


    //* Convert geocode to address with neshan web service
    const getAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
                {
                    method: "GET",
                    headers: {
                        "Api-Key": "service.74ea7f4d3a0e47f8831623c57f9c3ac9",
                    },
                }
            );
            const data = await response.json();
            if (data.status == 'OK') {
                const address = data.formatted_address;
                setAddress(address);
            }
        } catch (error) {
            console.log("error in catch get address-->", error);
        }
    };
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click(e) {

            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
            setLng(e.latlng.lng);
            setLat(e.latlng.lat);
            getAddress(e.latlng.lat,e.latlng.lng)

            // map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position} icon={new Icon({ iconUrl: 'images/icon96.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
            <Popup>موقعیت ثب شده قبلی اینجاست</Popup>
        </Marker>
    )
}



function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null
}


function DetectClick() {
    useMapEvent({
        click: e => console.log("Detect Click --->", e.latlng)
    })
    return null
}

