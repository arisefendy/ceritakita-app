const ERROR_MESSAGES = [
  // Auth
  {
    match: 'make sure your password is at least 8 characters',
    message: 'Password harus terdiri dari minimal 8 karakter',
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

  // No Internet
  {
    match: 'Failed to fetch',
    message: 'Tidak ada internet. Silakan cek koneksi Anda',
  },
];

export function mapErrorMessage(message) {
  const matchedError = ERROR_MESSAGES.find((err) => message?.includes(err.match));

  return matchedError ? matchedError.message : 'Terjadi kesalahan, silakan coba lagi';
}
