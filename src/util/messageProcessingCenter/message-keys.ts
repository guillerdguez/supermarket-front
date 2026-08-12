
export interface MessageDefinition {
  
  summary: string;
  
  detail: string;
}

export const MESSAGES = {
  errorLogin: { summary: "Login", detail: "Credenciales incorrectas" },
  sessionExpired: { summary: "Sesión", detail: "Tu sesión expiró. Iniciá sesión de nuevo." },
  accessDenied: { summary: "Acceso denegado", detail: "No tenés permisos para realizar esta acción." },

  errorGettingProducts: { summary: "Productos", detail: "Error al cargar productos" },
  errorGettingProduct: { summary: "Producto", detail: "Producto no encontrado" },
  productCreated: { summary: "Producto", detail: "Producto creado correctamente" },
  errorCreatingProduct: { summary: "Producto", detail: "Error al crear el producto" },
  productUpdated: { summary: "Producto", detail: "Producto actualizado correctamente" },
  errorUpdatingProduct: { summary: "Producto", detail: "Error al actualizar el producto" },
  productDeleted: { summary: "Producto", detail: "Producto eliminado correctamente" },
  errorDeletingProduct: { summary: "Producto", detail: "Error al eliminar el producto" },

  errorGettingBranches: { summary: "Sucursales", detail: "Error al cargar sucursales" },
  errorGettingBranch: { summary: "Sucursal", detail: "Sucursal no encontrada" },
  branchCreated: { summary: "Sucursal", detail: "Sucursal creada correctamente" },
  errorCreatingBranch: { summary: "Sucursal", detail: "Error al crear la sucursal" },
  branchUpdated: { summary: "Sucursal", detail: "Sucursal actualizada correctamente" },
  errorUpdatingBranch: { summary: "Sucursal", detail: "Error al actualizar la sucursal" },
  branchDeleted: { summary: "Sucursal", detail: "Sucursal eliminada correctamente" },
  errorDeletingBranch: { summary: "Sucursal", detail: "Error al eliminar la sucursal" },

  errorGettingUsers: { summary: "Usuarios", detail: "Error al cargar usuarios" },
  errorGettingUser: { summary: "Usuario", detail: "Usuario no encontrado" },
  userCreated: { summary: "Usuario", detail: "Usuario creado correctamente" },
  errorCreatingUser: { summary: "Usuario", detail: "Error al crear el usuario" },
  userUpdated: { summary: "Usuario", detail: "Usuario actualizado correctamente" },
  errorUpdatingUser: { summary: "Usuario", detail: "Error al actualizar el usuario" },
  userDeleted: { summary: "Usuario", detail: "Usuario desactivado correctamente" },
  errorDeletingUser: { summary: "Usuario", detail: "Error al desactivar el usuario" },
  userActivated: { summary: "Usuario", detail: "Usuario activado correctamente" },
  errorActivatingUser: { summary: "Usuario", detail: "Error al activar el usuario" },
  userRoleChanged: { summary: "Usuario", detail: "Rol actualizado correctamente" },
  errorChangingUserRole: { summary: "Usuario", detail: "Error al actualizar el rol" },

  errorGettingProfile: { summary: "Perfil", detail: "Error al cargar el perfil" },
  profileUpdated: { summary: "Perfil", detail: "Perfil actualizado correctamente" },
  errorUpdatingProfile: { summary: "Perfil", detail: "Error al actualizar el perfil" },
  passwordUpdated: { summary: "Contraseña", detail: "Contraseña actualizada correctamente" },
  errorUpdatingPassword: { summary: "Contraseña", detail: "Error al cambiar la contraseña" },
  passwordCurrentRequired: { summary: "Contraseña", detail: "Introduce tu contraseña actual" },
  passwordRulesNotMet: { summary: "Contraseña", detail: "La nueva contraseña no cumple todas las reglas" },
  passwordsMismatch: { summary: "Contraseña", detail: "Las contraseñas no coinciden" },

  errorGettingRegister: { summary: "Caja", detail: "Error al cargar la caja" },
  errorGettingRegisters: { summary: "Cajas", detail: "Error al cargar las cajas" },
  registerOpened: { summary: "Caja", detail: "Caja abierta correctamente" },
  errorOpeningRegister: { summary: "Caja", detail: "Error al abrir la caja" },
  registerClosed: { summary: "Caja", detail: "Caja cerrada correctamente" },
  errorClosingRegister: { summary: "Caja", detail: "Error al cerrar la caja" },

  errorGettingSales: { summary: "Ventas", detail: "Error al cargar las ventas" },
  errorGettingSaleDetail: { summary: "Venta", detail: "Error al cargar el detalle de la venta" },
  errorGettingMySales: { summary: "Mis ventas", detail: "Error al cargar tus ventas" },
  errorGettingMySaleDetail: { summary: "Venta", detail: "Error al cargar el detalle de la venta" },
  saleCreated: { summary: "Venta", detail: "Venta registrada correctamente" },
  errorCreatingSale: { summary: "Venta", detail: "Error al registrar la venta" },
  saleCancelled: { summary: "Venta", detail: "Venta cancelada correctamente" },
  errorCancellingSale: { summary: "Venta", detail: "No se pudo cancelar la venta" },

  errorGettingTransfers: { summary: "Transferencias", detail: "Error al cargar transferencias" },
  errorGettingTransferDetail: { summary: "Transferencia", detail: "Error al cargar el detalle de la transferencia" },
  errorGettingMyTransfers: { summary: "Transferencias", detail: "Error al cargar tus transferencias" },
  transferRequested: { summary: "Transferencia", detail: "Transferencia solicitada" },
  errorRequestingTransfer: { summary: "Transferencia", detail: "Error al solicitar la transferencia" },
  transferApproved: { summary: "Transferencia", detail: "Transferencia aprobada" },
  transferRejected: { summary: "Transferencia", detail: "Transferencia rechazada" },
  transferCompleted: { summary: "Transferencia", detail: "Transferencia completada" },
  transferCancelled: { summary: "Transferencia", detail: "Transferencia cancelada" },
  errorUpdatingTransfer: { summary: "Transferencia", detail: "Error al actualizar la transferencia" },

  errorGettingInventory: { summary: "Inventario", detail: "Error al cargar inventario" },
  errorGettingLowStock: { summary: "Inventario", detail: "Error al cargar alertas de stock" },
  errorGettingInventoryStatus: { summary: "Inventario", detail: "Error al cargar el estado del inventario" },
  stockUpdated: { summary: "Inventario", detail: "Stock actualizado" },
  lowStockWarning: { summary: "Stock bajo", detail: "El producto ha quedado por debajo del mínimo" },
  errorUpdatingStock: { summary: "Inventario", detail: "No se pudo actualizar el stock" },
  errorAdjustingStock: { summary: "Inventario", detail: "No se pudo ajustar el stock" },

  errorGettingNotifications: { summary: "Notificaciones", detail: "Error al cargar notificaciones" },
  errorDeletingNotification: { summary: "Notificación", detail: "No se pudo eliminar la notificación" },

  errorGettingReports: { summary: "Informes", detail: "Error al cargar los informes" },
  errorGettingCashRegisterReport: { summary: "Informes", detail: "Error al cargar el informe de cierres de caja" },
  errorGettingAuditLog: { summary: "Auditoría", detail: "Error al cargar el registro de auditoría" },
  errorGettingAuditLogDetail: { summary: "Auditoría", detail: "Error al cargar el detalle del registro" },
} as const satisfies Record<string, MessageDefinition>;

export type MessageKey = keyof typeof MESSAGES;
