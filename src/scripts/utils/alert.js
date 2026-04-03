import Swal from 'sweetalert2';

export function showSuccess(message) {
  return Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 1000,
    showConfirmButton: false,
  });
}

export function showError(message) {
  return Swal.fire({
    icon: 'error',
    title: 'Gagal',
    text: message,
    confirmButtonText: 'OK',
  });
}

export function showConfirm(message) {
  return Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  });
}
