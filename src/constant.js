export const token = localStorage.getItem('token')
export const headers = {
    Authorization: `Bearer ${token}`,
    "X-Custom-Header": "value"
}