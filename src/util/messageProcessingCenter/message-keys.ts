
export interface MessageDefinition {
  
  summary: string;
  
  detail: string;
}

export const MESSAGES = {
  // --- auth ---
  errorLogin: { summary: "Login", detail: "Credenciales incorrectas" },
  sessionExpired: { summary: "Sesión", detail: "Tu sesión expiró. Iniciá sesión de nuevo." },

  // --- products ---
  errorGettingProducts: { summary: "Productos", detail: "Error al cargar productos" },
  errorGettingProduct: { summary: "Producto", detail: "Producto no encontrado" },
  productCreated: { summary: "Producto", detail: "Producto creado correctamente" },
  errorCreatingProduct: { summary: "Producto", detail: "Error al crear el producto" },
  productUpdated: { summary: "Producto", detail: "Producto actualizado correctamente" },
  errorUpdatingProduct: { summary: "Producto", detail: "Error al actualizar el producto" },
  productDeleted: { summary: "Producto", detail: "Producto eliminado correctamente" },
  errorDeletingProduct: { summary: "Producto", detail: "Error al eliminar el producto" },

  // --- branches ---
  errorGettingBranches: { summary: "Sucursales", detail: "Error al cargar sucursales" },
  errorGettingBranch: { summary: "Sucursal", detail: "Sucursal no encontrada" },
  branchCreated: { summary: "Sucursal", detail: "Sucursal creada correctamente" },
  errorCreatingBranch: { summary: "Sucursal", detail: "Error al crear la sucursal" },
  branchUpdated: { summary: "Sucursal", detail: "Sucursal actualizada correctamente" },
  errorUpdatingBranch: { summary: "Sucursal", detail: "Error al actualizar la sucursal" },
  branchDeleted: { summary: "Sucursal", detail: "Sucursal eliminada correctamente" },
  errorDeletingBranch: { summary: "Sucursal", detail: "Error al eliminar la sucursal" },

  // --- users ---
  errorGettingUsers: { summary: "Usuarios", detail: "Error al cargar usuarios" },
  errorGettingUser: { summary: "Usuario", detail: "Usuario no encontrado" },
  userCreated: { summary: "Usuario", detail: "Usuario creado correctamente" },
  errorCreatingUser: { summary: "Usuario", detail: "Error al crear el usuario" },
  userUpdated: { summary: "Usuario", detail: "Usuario actualizado correctamente" },
  errorUpdatingUser: { summary: "Usuario", detail: "Error al actualizar el usuario" },
  userDeleted: { summary: "Usuario", detail: "Usuario desactivado correctamente" },
  errorDeletingUser: { summary: "Usuario", detail: "Error al desactivar el usuario" },

  // --- profile ---
  errorGettingProfile: { summary: "Perfil", detail: "Error al cargar el perfil" },
  profileUpdated: { summary: "Perfil", detail: "Perfil actualizado correctamente" },
  errorUpdatingProfile: { summary: "Perfil", detail: "Error al actualizar el perfil" },
  passwordUpdated: { summary: "Contraseña", detail: "Contraseña actualizada correctamente" },
  errorUpdatingPassword: { summary: "Contraseña", detail: "Error al cambiar la contraseña" },

  // --- cash registers ---
  errorGettingRegister: { summary: "Caja", detail: "Error al cargar la caja" },
  errorGettingRegisters: { summary: "Cajas", detail: "Error al cargar las cajas" },
  registerOpened: { summary: "Caja", detail: "Caja abierta correctamente" },
  errorOpeningRegister: { summary: "Caja", detail: "Error al abrir la caja" },
  registerClosed: { summary: "Caja", detail: "Caja cerrada correctamente" },
  errorClosingRegister: { summary: "Caja", detail: "Error al cerrar la caja" },

  // --- sales ---
  errorGettingSales: { summary: "Ventas", detail: "Error al cargar las ventas" },
  errorGettingMySales: { summary: "Mis ventas", detail: "Error al cargar tus ventas" },
  saleCreated: { summary: "Venta", detail: "Venta registrada correctamente" },
  errorCreatingSale: { summary: "Venta", detail: "Error al registrar la venta" },
  saleCancelled: { summary: "Venta", detail: "Venta cancelada correctamente" },
  errorCancellingSale: { summary: "Venta", detail: "No se pudo cancelar la venta" },

  // --- transfers ---
  errorGettingTransfers: { summary: "Transferencias", detail: "Error al cargar transferencias" },
  errorGettingMyTransfers: { summary: "Transferencias", detail: "Error al cargar tus transferencias" },
  transferRequested: { summary: "Transferencia", detail: "Transferencia solicitada" },
  errorRequestingTransfer: { summary: "Transferencia", detail: "Error al solicitar la transferencia" },
  transferApproved: { summary: "Transferencia", detail: "Transferencia aprobada" },
  transferRejected: { summary: "Transferencia", detail: "Transferencia rechazada" },
  transferCompleted: { summary: "Transferencia", detail: "Transferencia completada" },
  transferCancelled: { summary: "Transferencia", detail: "Transferencia cancelada" },
  errorUpdatingTransfer: { summary: "Transferencia", detail: "Error al actualizar la transferencia" },

  // --- inventory ---
  errorGettingInventory: { summary: "Inventario", detail: "Error al cargar inventario" },
  errorGettingLowStock: { summary: "Inventario", detail: "Error al cargar alertas de stock" },
  errorGettingInventoryStatus: { summary: "Inventario", detail: "Error al cargar el estado del inventario" },
  stockUpdated: { summary: "Inventario", detail: "Stock actualizado" },
  lowStockWarning: { summary: "Stock bajo", detail: "El producto ha quedado por debajo del mínimo" },
  errorUpdatingStock: { summary: "Inventario", detail: "No se pudo actualizar el stock" },
  errorAdjustingStock: { summary: "Inventario", detail: "No se pudo ajustar el stock" },

  // --- notifications ---
  errorGettingNotifications: { summary: "Notificaciones", detail: "Error al cargar notificaciones" },
  errorDeletingNotification: { summary: "Notificación", detail: "No se pudo eliminar la notificación" },

  // --- reports & audit ---
  errorGettingReports: { summary: "Informes", detail: "Error al cargar los informes" },
  errorGettingAuditLog: { summary: "Auditoría", detail: "Error al cargar el registro de auditoría" },
} as const satisfies Record<string, MessageDefinition>;

export type MessageKey = keyof typeof MESSAGES;
