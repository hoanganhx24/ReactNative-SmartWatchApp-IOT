// Location Service - Quản lý GPS và vị trí

import apiService from './api.service';

class LocationService {
    constructor() {
        this.watchId = null;
        this.currentLocation = null;
        this.isTracking = false;
    }

    /**
     * Lấy vị trí hiện tại
     */
    async getCurrentLocation() {
        try {
            console.log('📍 Đang lấy vị trí hiện tại...');

            // Giả lập lấy GPS location
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock location (Hà Nội)
            const location = {
                latitude: 21.0285 + (Math.random() - 0.5) * 0.01,
                longitude: 105.8542 + (Math.random() - 0.5) * 0.01,
                altitude: 12,
                accuracy: 10,
                altitudeAccuracy: 5,
                heading: 0,
                speed: 0,
                timestamp: new Date().getTime()
            };

            this.currentLocation = location;

            console.log('✅ Vị trí hiện tại:', location);

            return location;
        } catch (error) {
            console.error('Lỗi lấy vị trí:', error);
            throw new Error('Không thể lấy vị trí. Vui lòng bật GPS và cấp quyền truy cập vị trí.');
        }
    }

    /**
     * Theo dõi vị trí liên tục
     */
    async startTracking(options = {}) {
        if (this.isTracking) {
            console.log('⚠️ Đang theo dõi vị trí rồi');
            return;
        }

        try {
            console.log('🔄 Bắt đầu theo dõi vị trí...');

            const {
                interval = 5000, // 5 giây
                onLocationUpdate,
                userId
            } = options;

            this.isTracking = true;

            // Giả lập theo dõi vị trí liên tục
            this.watchId = setInterval(async () => {
                try {
                    const location = await this.getCurrentLocation();

                    // Cập nhật lên server nếu có userId
                    if (userId) {
                        await apiService.updateLocation(
                            userId,
                            location.latitude,
                            location.longitude
                        );
                    }

                    // Callback với location mới
                    if (onLocationUpdate) {
                        onLocationUpdate(location);
                    }
                } catch (error) {
                    console.error('Lỗi cập nhật vị trí:', error);
                }
            }, interval);

            console.log('✅ Đã bắt đầu theo dõi vị trí');
        } catch (error) {
            console.error('Lỗi bắt đầu theo dõi vị trí:', error);
            this.isTracking = false;
            throw error;
        }
    }

    /**
     * Dừng theo dõi vị trí
     */
    stopTracking() {
        if (!this.isTracking) {
            return;
        }

        console.log('🛑 Dừng theo dõi vị trí');

        if (this.watchId) {
            clearInterval(this.watchId);
            this.watchId = null;
        }

        this.isTracking = false;
    }

    /**
     * Lấy địa chỉ từ tọa độ (Reverse Geocoding)
     */
    async getAddressFromCoordinates(latitude, longitude) {
        try {
            console.log('🗺️ Đang lấy địa chỉ từ tọa độ...');

            // Giả lập reverse geocoding
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock address
            const addresses = [
                'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
                'Số 144 Xuân Thủy, Cầu Giấy, Hà Nội',
                'Số 1 Giảng Võ, Ba Đình, Hà Nội',
                'Số 54 Triều Khúc, Thanh Xuân, Hà Nội'
            ];

            const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];

            return {
                address: randomAddress,
                street: randomAddress.split(',')[0],
                district: randomAddress.split(',')[1]?.trim(),
                city: 'Hà Nội',
                country: 'Việt Nam',
                latitude,
                longitude
            };
        } catch (error) {
            console.error('Lỗi lấy địa chỉ:', error);
            return null;
        }
    }

    /**
     * Tính khoảng cách giữa 2 điểm (Haversine formula)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Bán kính Trái Đất (km)
        const dLat = this._toRad(lat2 - lat1);
        const dLon = this._toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance; // km
    }

    /**
     * Chuyển đổi độ sang radian
     */
    _toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Kiểm tra quyền truy cập vị trí
     */
    async checkPermission() {
        console.log('🔐 Kiểm tra quyền truy cập vị trí...');

        // Giả lập kiểm tra quyền
        await new Promise(resolve => setTimeout(resolve, 200));

        // Trong thực tế sẽ dùng PermissionsAndroid (Android) hoặc Geolocation.requestAuthorization (iOS)
        return {
            authorized: true,
            message: 'Đã cấp quyền truy cập vị trí'
        };
    }

    /**
     * Yêu cầu quyền truy cập vị trí
     */
    async requestPermission() {
        console.log('📝 Yêu cầu quyền truy cập vị trí...');

        // Giả lập yêu cầu quyền
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            granted: true,
            message: 'Người dùng đã cấp quyền truy cập vị trí'
        };
    }

    /**
     * Lấy URL Google Maps
     */
    getGoogleMapsUrl(latitude, longitude) {
        return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }

    /**
     * Lấy trạng thái theo dõi
     */
    getTrackingStatus() {
        return {
            isTracking: this.isTracking,
            currentLocation: this.currentLocation
        };
    }
}

// Export singleton instance
const locationService = new LocationService();
export default locationService;