import './CounterBar.scss';

export function CounterBar({ color = '#12837F', progress = '0', barStyles = '' }) {
  return (
    <div className={`w-100 counter-bar ${barStyles}`}>
      <div
        className="color-bar"
        style={{
          width: `${progress}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
}

export default CounterBar;
