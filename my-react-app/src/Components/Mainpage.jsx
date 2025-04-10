import React, { useEffect, useRef, useState } from 'react';
import './Components.css';
import maplibregl from 'maplibre-gl';
import Navbar from './Navbar';

function Mainpage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [addingPlace, setAddingPlace] = useState(false);
  const [addingReview, setAddingReview] = useState(false);

  const loadPlaces = async (map) => {
    try {
      const response = await fetch("http://localhost:5000/places");
      const places = await response.json();

      places.forEach(place => {
        
        
        const reviewHTML = place.reviews?.map((r, i) => `
        <li>
          <strong>${r.message}</strong><br>
          
        </li>
      `).join('') || '';
      





        console.log(place.reviews)
        const popupHTML = `
          <h3>${place.name}</h3>
          <p>${place.description}</p>
          <ul>${reviewHTML}</ul>
          <button onclick="window.reviewPlace('${place.latitude}', '${place.longitude}')">Add Review</button>
        `;

        new maplibregl.Marker()
          .setLngLat([place.longitude, place.latitude])
          .setPopup(new maplibregl.Popup().setHTML(popupHTML))
          .addTo(map);
      });
    } catch (error) {
      console.error("Error loading places:", error);
    }
  };

  const savePlace = async ({ name, description, lat, lng }) => {
    try {
      const res = await fetch("http://localhost:5000/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, latitude: lat, longitude: lng })
      });
      const saved = await res.json();
    
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const sendReview = async ({ lat, lng, message }) => {
    try {
      await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng,message:message })
      });
      alert("Review added!");
      window.location.reload();
    } catch (err) {
        console.log(err)
      alert("Error adding review");
    }
  };

  useEffect(() => {
    const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [13.388, 52.517],
        zoom: 9.5,
        preserveDrawingBuffer: true  
      });
      

    mapRef.current = map;
    loadPlaces(map);

    map.on('click', async (e) => {
      const { lng, lat } = e.lngLat;

      if (addingPlace) {
        const name = prompt("Enter Place Name:");
        const description = prompt("Enter Description:");

        if (name && description) {
          await savePlace({ name, description, lat, lng });
          new maplibregl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup().setHTML(`<h3>${name}</h3><p>${description}</p>`))
            .addTo(map);
        }

        setAddingPlace(false);
      }

      if (addingReview) {
        const message = prompt("Enter your review:");
        console.log(lat)
        if (message) await sendReview({ lat, lng, message });
        setAddingReview(false);
      }
    });


    window.reviewPlace = (lat, lng) => {
      const message = prompt("Write your review:");
      if (message) sendReview({ lat, lng, message });
    };

    return () => map.remove();
  }, [addingPlace, addingReview]);

  return (
    <>
      <Navbar/>
      <div className="control">
    
        <button onClick={() => {
          alert("Click on the map to add a new place");
          setAddingPlace(true);
        }}>Add Place</button>

        <button onClick={() => {
          alert("Click a place to add review");
          setAddingReview(true);
        }}>Review</button>
      </div>
      <div className="map-container" ref={mapContainer} />
    </>
  );
}

export default Mainpage;
