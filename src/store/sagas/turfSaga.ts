import { call, put, takeLatest } from 'redux-saga/effects';
import {
    fetchVenuesRequest, fetchVenuesSuccess, fetchVenuesFailure,
    fetchMyBookingsRequest, fetchMyBookingsSuccess, fetchMyBookingsFailure
} from '../slices/turfSlice';
import { API_BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* handleFetchVenues(action: any): any {
    try {
        const { lat, lng, city } = action.payload;
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');

        let url = `${API_BASE_URL}/turf`;
        if (city) {
            url += `?city=${encodeURIComponent(city)}`;
        } else if (lat && lng) {
            url += `?lat=${lat}&lng=${lng}`;
        }

        const response = yield call(fetch, url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        const data = yield response.json();
        if (response.ok) {
            const mappedVenues = data.map((item: any) => ({
                id: item.id || item._id,
                name: item.name,
                distance: item.distance ? `${parseFloat(item.distance).toFixed(1)} km away` : 'Near you',
                price: item.price ? `${item.price} / per hour` : 'Price on request',
                rating: parseFloat(item.rating) || 4.5,
                image: item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                lat: parseFloat(item.lat || item.latitude),
                lng: parseFloat(item.lng || item.longitude),
                sport: item.sport || item.category || 'Multi-sport',
                city: item.city
            }));

            yield put(fetchVenuesSuccess({
                venues: mappedVenues,
                address: city || undefined
            }));
        } else {
            yield put(fetchVenuesFailure(data.message || 'Failed to fetch venues'));
        }
    } catch (error: any) {
        yield put(fetchVenuesFailure(error.message));
    }
}

function* handleFetchMyBookings(): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/nur/user/bookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(fetchMyBookingsSuccess(data.bookings || []));
        } else {
            yield put(fetchMyBookingsFailure(data.message || 'Failed to fetch bookings'));
        }
    } catch (error: any) {
        yield put(fetchMyBookingsFailure(error.message));
    }
}

export function* turfSaga() {
    yield takeLatest(fetchVenuesRequest.type, handleFetchVenues);
    yield takeLatest(fetchMyBookingsRequest.type, handleFetchMyBookings);
}
