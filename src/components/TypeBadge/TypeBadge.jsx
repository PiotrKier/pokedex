import "./TypeBadge.css";

function TypeBadge({ type }) {

  return (
    <span className={`type-badge ${type}`}>
      {type}
    </span>
  );

}

export default TypeBadge;