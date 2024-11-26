export default function Button({icon, text}) {
  return (
    <button className="bg-indigo-800 p-3 rounded">
        {icon}
        <span>{text}</span>
    </button>
  )
}
