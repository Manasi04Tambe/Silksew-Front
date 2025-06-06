import { FaStar } from "react-icons/fa";

const StarRating = ({star}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((stars, index) => (
        <FaStar
          key={index}
          size={20}
          style={{ cursor: "pointer", color: (index < star) ? "orange" : "" }}
        />
      ))}
    </div>
  );
};

export default StarRating;
