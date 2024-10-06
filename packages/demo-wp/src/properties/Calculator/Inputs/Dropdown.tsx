type tDropdownWrapperProps = {
  children: () => // hovering: boolean,
  // isOpen: boolean,
  // toggleCollapse: () => void
  JSX.Element;
};

function DropdownWrapper({ children }: tDropdownWrapperProps) {
  //   const [hovering, setHovering] = useState<boolean>(false);

  //   const [isOpen, setIsOpen] = useState(false);
  //   const toggleCollapse = () => {
  //     setIsOpen(!isOpen);
  //   };

  //   <tr
  //     onMouseEnter={() => setHovering(true)}
  //     onMouseLeave={() => setHovering(false)}
  //   >
  // {/* {childrenWithProps} */}
  //     {children(hovering, isOpen, toggleCollapse)}
  //   </tr>

  return (
    <div>
      <select className="select select-sm bg-opacity-0">{children()}</select>
    </div>
  );
}

type tDropdownProps = {
  label: string;
};

function Dropdown({ label }: tDropdownProps) {
  console.log('label: ', label);
  return (
    <div>
      <select className="select select-sm bg-opacity-0">
        <option>Monthly Income</option>
        <option>Annual Income</option>
      </select>
    </div>
  );
}

function IncomeDropdown() {}

export { Dropdown };
