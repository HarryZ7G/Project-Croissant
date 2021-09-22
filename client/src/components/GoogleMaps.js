import React, { useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: 'min(96vw, 48vh)',
  height: 'min(96vw, 48vh)',
  borderRadius: '1vh'
};

function MyComponent(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyD7oE7UNkxl3lM13HAPNC5gjoFdqmPz6q8"
  })

  const [map, setMap] = React.useState(null);
  const [position, setPosition] = React.useState({lat: null, lng: null});
  const [marker, setMarker] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    let bounds = new window.google.maps.LatLngBounds(
      {
        lat: 43.5810245,
        lng: -79.639219
      },
      {
        lat: 43.8554579,
        lng: -79.1168971
      }
    );
    map.fitBounds(bounds);
    setMap(map);
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    if (window.google && (props.center.lat !== position.lat || props.center.lng !== position.lng)) {
      let bounds = new window.google.maps.LatLngBounds(props.bounds.southwest, props.bounds.northeast);
      setPosition(props.center);
      setMarker(<Marker position={props.center}/>);
      map.fitBounds(bounds);
      setMap(map);
    }
  }, [props.center]);

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        clickableIcons={false}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {marker}
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)