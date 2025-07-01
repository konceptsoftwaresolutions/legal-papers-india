import { toast } from 'react-toastify';

/**
 * @param {Object} props
 * @param {String} props.msg The message to display in the toast.
 * @param {'top-center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'} [props.position='top-center'] The position of the toast.
 * @param {Number} [props.autoClose=700] Duration (in ms) for which the toast remains visible.
 * @param {Boolean} [props.pauseOnHover=true] Whether to pause the toast when hovering over it.
 * @param {Boolean} [props.draggable=true] Whether the toast is draggable.
 * @param {Boolean} [props.closeOnClick=true] Whether to close the toast on click.
 * @param {'default' | 'info' | 'success' | 'error' | 'warning'} [props.type='default'] The type of toast ('info', 'success', 'error', 'warning', etc.)
 * @param {Boolean} [props.isLoading=false] Whether the toast should display a loading spinner.
 * @param {String} [props.icon=null] A custom icon to display in the toast.
 * @param {Object} [props.style={}] Custom styles to apply to the toast.
 * @param {Object} [props.className=''] Additional class names to add to the toast.
 */
const toastify = ({
  msg = '',
  position = 'top-center',
  autoClose = 1000,
  pauseOnHover = true,
  draggable = true,
  closeOnClick = true,
  type = 'success',
  style = {},
  className = ''
}) => {
  toast(msg, {
    type,
    position,
    autoClose,
    pauseOnHover,
    draggable,
    closeOnClick,
    style,
    className
  })
};

export default toastify;
