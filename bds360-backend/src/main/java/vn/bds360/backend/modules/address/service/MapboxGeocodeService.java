package vn.bds360.backend.modules.address.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import vn.bds360.backend.modules.address.config.MapboxConfig;

@Service
public class MapboxGeocodeService {

    @Autowired
    private MapboxConfig mapboxConfig;

    public Optional<double[]> getLatLngFromAddress(String fullAddress) {
        try {
            String encodedAddress = URLEncoder.encode(fullAddress, StandardCharsets.UTF_8);
            String url = String.format(
                    "https://api.mapbox.com/geocoding/v5/mapbox.places/%s.json?access_token=%s&language=vi&country=VN",
                    encodedAddress,
                    mapboxConfig.getMapboxApiKey());

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());

            JsonNode features = root.get("features");
            if (features != null && features.size() > 0) {
                JsonNode coordinates = features.get(0).get("geometry").get("coordinates");
                double longitude = coordinates.get(0).asDouble();
                double latitude = coordinates.get(1).asDouble();
                return Optional.of(new double[] { longitude, latitude });
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return Optional.empty();
    }
}
