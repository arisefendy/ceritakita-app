const ERROR_MESSAGES = [
  // Auth
  {
    match: 'make sure your password is at least 8 characters',
    message: 'Gunakan minimal 8 karakter untuk password Anda.',
  },
  {
    match: 'User not found',
    message: 'Akun tidak ditemukan. Periksa kembali email Anda',
  },
  {
    match: 'Invalid password',
    message: 'Password yang Anda masukkan salah',
  },
  {
    match: 'Email is already taken',
    message: 'Email sudah digunakan, silakan gunakan email lain',
  },

  // Story
  {
    match: 'photo should be Readable',
    message: 'Harap unggah foto untuk melanjutkan.',
  },
  {
    match: 'Payload content length greater than maximum allowed: 1000000',
    message: 'Ukuran foto terlalu besar. Silahkan pilih foto maksimal 1MB',
  },
  {
    match: 'Story not found',
    message: 'Cerita tidak dapat ditemukan. Pastikan cerita masih tersedia atau coba lagi nanti.',
  },

  // No Internet
  {
    match: 'Failed to fetch',
    message: 'Gagal terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.',
  },
];

const CAMERA_ERROR_MESSAGES = {
  NotAllowedError: 'Izin kamera ditolak. Silakan izinkan akses kamera di browser Anda.',
  NotFoundError: 'Tidak dapat menemukan kamera di perangkat Anda.',
  NotReadableError:
    'Kamera sedang digunakan oleh aplikasi lain. Silakan tutup aplikasi lain atau coba lagi.',
};

export function mapErrorMessage(message) {
  const matchedError = ERROR_MESSAGES.find((err) => message?.includes(err.match));

  return matchedError ? matchedError.message : 'Terjadi kesalahan, silakan coba lagi';
}

export function mapCameraError(error) {
  return CAMERA_ERROR_MESSAGES[error?.name] || 'Gagal mengakses kamera';
}
