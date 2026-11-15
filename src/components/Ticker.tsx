interface TickerProps {
  items: string[];
}

/**
 * Seamless data strip. The track holds two identical groups and slides by
 * exactly half its width, so the loop has no seam. Purely decorative: the same
 * figures are stated in the hero meta and the stats row.
 */
const Ticker = ({ items }: TickerProps) => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker__track">
      {[0, 1].map((group) => (
        <div className="ticker__group" key={group}>
          {items.map((item) => (
            <span className="ticker__item" key={item}>
              <span className="ticker__dot" />
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Ticker;
