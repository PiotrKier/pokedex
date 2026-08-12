import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvolutionChain, getPokemon } from "../../services/pokeApi";
import fallbackImage from "../../assets/images/Question_mark_pokeball.png";

import "./Ewolution.css";

function Ewolution({ chainUrl, current }) {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chainUrl) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const chainData = await getEvolutionChain(chainUrl);

        // zbierz węzły metodą BFS, zachowując szczegóły ewolucji
        const stagesNodes = [];
        let queue = [chainData.chain];

        while (queue.length) {
          const nodes = queue.map((n) => {
            return {
              name: n.species.name,
              evolves_to: n.evolves_to.map((child) => ({
                name: child.species.name,
                min_level: child.evolution_details[0]?.min_level ?? null,
                trigger: child.evolution_details[0]?.trigger?.name ?? null,
                item: child.evolution_details[0]?.item?.name ?? null,
              })),
            };
          });

          stagesNodes.push(nodes);

          const next = [];
          queue.forEach((n) => {
            if (n.evolves_to && n.evolves_to.length) {
              n.evolves_to.forEach((e) => next.push(e));
            }
          });

          queue = next;
        }

        // for each species fetch sprite and merge evolves_to
        const stagesWithData = await Promise.all(
          stagesNodes.map(async (stage) => {
            const items = await Promise.all(
              stage.map(async (node) => {
                try {
                  const p = await getPokemon(node.name);
                  const img =
                    p.sprites?.other?.["official-artwork"]?.front_default || p.sprites?.front_default || null;
                  return { ...node, img };
                } catch (e) {
                  return { ...node, img: null };
                }
              })
            );
            return items;
          })
        );

        if (!cancelled) setStages(stagesWithData);
      } catch (e) {
        console.warn(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [chainUrl]);

  if (loading) return <p>Ładowanie drzewa ewolucji...</p>;
  if (!stages.length) return <p>Brak danych o ewolucji.</p>;

  return (
    <div className="ewolution-root">
      {stages.map((stage, idx) => (
        <div className="evo-stage" key={idx}>
          {stage.map((s) => (
            <div
              key={s.name}
              className={`evo-item ${s.name === current ? "current" : ""}`}
            >
              <div className="evo-main">
                <Link to={`/pokemon/${s.name}`} className="evo-link">
                  <img src={s.img || fallbackImage} alt={s.name} />
                </Link>
                <div className="evo-meta">
                  <div className="evo-name">{s.name}</div>
                  {s.evolves_to && s.evolves_to.length ? (
                    <div className="evo-reqs">
                      {s.evolves_to.map((t) => (
                        <div key={t.name} className="evo-req">
                          <span className="to">→ {t.name}</span>
                          <span className="lvl">
                            {t.min_level
                              ? `lvl ${t.min_level}`
                              : t.item
                              ? `użyj ${t.item.replace(/-/g, " ")}`
                              : t.trigger
                              ? t.trigger.replace(/-/g, " ")
                              : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="evo-reqs">
                      <div className="evo-req">Brak dalszej ewolucji</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {idx < stages.length - 1 && <div className="evo-arrow">↓</div>}
        </div>
      ))}
    </div>
  );
}

export default Ewolution;
