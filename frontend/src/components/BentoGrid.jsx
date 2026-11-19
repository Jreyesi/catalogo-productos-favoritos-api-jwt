import { metadatosProducto } from '../data/productos.js';
import { imagenProducto } from '../productImages.js';
import { formatPrice } from '../utils/formatPrice.js';

function buscar(productos, patron, indice) {
  return productos.find((producto) => patron.test(producto.nombre)) ?? productos[indice] ?? {};
}

export default function BentoGrid({ productos, onQuickAdd }) {
  const proteina = buscar(productos, /whey|prote/i, 0);
  const creatina = buscar(productos, /creatina/i, 1);
  const bcaa = buscar(productos, /bcaa|amino/i, 2);
  const thermo = buscar(productos, /thermo|burn/i, 3);
  const preworkout = buscar(productos, /pre[\s-]?workout|pump/i, 4);

  return (
    <section className="bento" id="beneficios">
      <article className="tile brand">
        <div className="kicker">Ironpulse / 2026</div>
        <h2>Entrena<br />duro.<br /><span>Recupera</span><br />mejor.</h2>
        <p>Fórmulas seleccionadas con criterio clínico. Sin rellenos, sin ruido, solo lo que tu cuerpo usa.</p>
      </article>

      <article className="tile hero-img">
        <img src={imagenProducto(proteina)} alt={`Envase de ${proteina.nombre ?? 'proteína'}`} />
      </article>

      <article className="tile small lilac">
        <div>
          <span className="badge">01 / Proteína</span>
          <h3>Aislamiento total</h3>
          <p>{proteina.descripcion}</p>
        </div>
        <div className="price">{formatPrice(proteina.precio)} <small>{metadatosProducto(proteina).servings}</small></div>
      </article>

      <article className="tile feature violet">
        <span className="badge">Top ventas</span>
        <h3>{proteina.nombre}</h3>
        <p>La proteína que más se mueve esta semana.</p>
        <button className="btn-light" type="button" onClick={() => onQuickAdd(proteina)}>Añadir rápido</button>
      </article>

      <article className="tile photo photo--creatina">
        <img src={imagenProducto(creatina)} alt={`Envase de ${creatina.nombre ?? 'creatina'}`} />
      </article>

      <article className="tile mid dark">
        <div>
          <span className="badge">02 / Fuerza</span>
          <h3>{creatina.nombre}</h3>
          <p>{creatina.descripcion}</p>
        </div>
        <button className="btn-light" type="button" onClick={() => onQuickAdd(creatina)}>Añadir top</button>
      </article>

      <article className="tile wide orange tile-split">
        <div className="tile-split__copy">
          <span className="badge">03 / Pre-entreno</span>
          <h3>{preworkout.nombre}</h3>
          <p>{preworkout.descripcion}</p>
          <div className="price">{formatPrice(preworkout.precio)} <small>{metadatosProducto(preworkout).servings}</small></div>
        </div>
        <img src={imagenProducto(preworkout)} alt={`Envase de ${preworkout.nombre ?? 'pre-entreno'}`} />
      </article>

      <article className="tile wide lime tile-split">
        <div className="tile-split__copy">
          <span className="badge">04 / Recuperación</span>
          <h3>{bcaa.nombre}</h3>
          <p>{bcaa.descripcion}</p>
          <span className="badge">Envío gratis +$60</span>
        </div>
        <img src={imagenProducto(bcaa)} alt={`Envase de ${bcaa.nombre ?? 'BCAA'}`} />
      </article>

      <article className="tile photo photo--thermo celeste">
        <img src={imagenProducto(thermo)} alt={`Envase de ${thermo.nombre ?? 'quemador'}`} />
      </article>

      <article className="tile mid mauve">
        <div>
          <span className="badge">05 / Quemadores</span>
          <h3>{thermo.nombre}</h3>
          <p>Complejo con cafeína y té verde.</p>
          <div className="price">{formatPrice(thermo.precio)} <small>{metadatosProducto(thermo).servings}</small></div>
        </div>
      </article>
    </section>
  );
}
