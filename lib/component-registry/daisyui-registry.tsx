"use client";

import { ComponentRegistry } from "./types";

// DaisyUI uses HTML + CSS classes, so we can render native elements with classes
export const daisyuiRegistry: ComponentRegistry = {
  button: {
    component: <button className="btn btn-primary">Click me</button>,
    code: `export default function Demo() {
  return <button className="btn btn-primary">Click me</button>;
}`,
  },
  input: {
    component: (
      <input
        type="text"
        placeholder="Enter text..."
        className="input input-bordered w-full max-w-xs"
      />
    ),
    code: `export default function Demo() {
  return <input type="text" placeholder="Enter text..." className="input input-bordered w-full max-w-xs" />;
}`,
  },
  card: {
    component: (
      <div className="card w-96 bg-base-100 shadow-xl border">
        <div className="card-body">
          <h2 className="card-title">Card Title</h2>
          <p>Card content goes here</p>
        </div>
      </div>
    ),
    code: `export default function Demo() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Card Title</h2>
        <p>Card content goes here</p>
      </div>
    </div>
  );
}`,
  },
  badge: {
    component: <div className="badge badge-primary">New</div>,
    code: `export default function Demo() {
  return <div className="badge badge-primary">New</div>;
}`,
  },
  checkbox: {
    component: <input type="checkbox" className="checkbox" />,
    code: `export default function Demo() {
  return <input type="checkbox" className="checkbox" />;
}`,
  },
  switch: {
    component: <input type="checkbox" className="toggle" />,
    code: `export default function Demo() {
  return <input type="checkbox" className="toggle" />;
}`,
  },
  slider: {
    component: (
      <input
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        className="range w-64"
      />
    ),
    code: `export default function Demo() {
  return <input type="range" min="0" max="100" defaultValue="50" className="range" />;
}`,
  },
  avatar: {
    component: (
      <div className="avatar">
        <div className="w-12 rounded-full">
          <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
            <span className="text-xl">A</span>
          </div>
        </div>
      </div>
    ),
    code: `export default function Demo() {
  return (
    <div className="avatar">
      <div className="w-12 rounded-full">
        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
      </div>
    </div>
  );
}`,
  },
};
