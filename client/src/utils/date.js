const dateOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
}

export default function getDate(timestamp) {
    return new Date(Number(timestamp)).toLocaleDateString('bg-BG', dateOptions)
}
