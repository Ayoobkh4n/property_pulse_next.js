"use client";
import { useEffect, useState, useRef } from "react";
// import { setDefaults, fromAddress } from "react-geocode";
import opencage from "opencage-api-client";
import Image from "next/image";
import Pin from "@/assets/images/pin.svg";
import Spinner from "./Spinner";
import maplibregl from "maplibre-gl";
// import { Map, Marker } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [viewPort, setViewPort] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });

  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // <-- store map instance here

  //   setDefaults({
  //     key: process.env.GOOGLE_MAP_API_KEY,
  //     language: "en",
  //     region: "us",
  //   });

  //   console.log(process.env.NEXT_PUBLIC_OPENCAGE_API_KEY);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await opencage.geocode({
          q: `${property.location.street}" "${property.location.city}" "${property.location.state}" "${property.location.zipcode}`,
          key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
        });

        // const res = await fromAddress(
        //   `${property.location.street}${property.location.city}${property.location.state}${property.location.zipcode}`
        // );

        //check geocode results

        console.log(res);

        if (res.results.length === 0) {
          setGeocodeError(true);
          return;
        }

        const { lat, lng } = res.results[0].geometry;
        // console.log(lat, lng);
        setLat(lat);
        setLong(lng);
        setViewPort({
          ...viewPort,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCoords();
  }, []);

  console.log(lat, long);
  useEffect(() => {
    if (lat && long && mapContainerRef.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current, // container id
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`, // style URL
        center: [long, lat], // starting position [lng, lat]
        zoom: 10, // starting zoom
      });

      const el = document.createElement("img");
      el.src = Pin.src;
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.objectFit = "contain";

      el.addEventListener("click", () => {
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${long}`;
        window.open(googleMapsUrl, "_blank");
      });

      new maplibregl.Marker({ element: el })
        .setLngLat([long, lat])
        .addTo(mapRef.current);
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [lat, long]);

  //   console.log(mapRef.current);

  if (loading) return <Spinner />;
  if (geocodeError)
    return <div className="text-xl">No Location data found</div>;
  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "500px", borderRadius: "0.5rem" }}
    />

    // <div>
    //   <Map
    //     mapLib={import("maplibre-gl")}
    //     initialViewState={{
    //       longitude: long,
    //       latitude: lat,
    //       zoom: 12,
    //     }}
    //     style={{ width: "100%", height: "200px" }}
    //     mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${NEXT_PUBLIC_MAPTILER_KEY}`}
    //   >
    //     <Marker longitude={long} latitude={lat} anchor="bottom">
    //       <Image src={pin} alt="Pin" width={40} height={40} />
    //     </Marker>
    //   </Map>
    // </div>
  );
};

export default PropertyMap;
