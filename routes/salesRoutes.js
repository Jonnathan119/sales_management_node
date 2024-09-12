// routes/salesRoutes.js
const express = require('express');
const moment = require('moment-timezone'); 
const Sale = require('../models/sale');
const sale = require('../models/sale');
const router = express.Router();

// función de precio a pesos colombianos
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
};

// para obtener todas las ventas en base de datos
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().populate('user', 'username -_id');

    const formattedSales = sales.map(sale => ({
      ...sale.toObject(),
      clientExpeditionDate: moment(sale.clientExpeditionDate).format('YYYY-MM-DD'), // Formato de fecha
      product: {
        ...sale.product,
        price: formatPrice(sale.product.price)
      }
    }));

    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una venta por ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('user', 'username -_id');
    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const formattedSale = {
      ...sale.toObject(),
      clientExpeditionDate: moment(sale.clientExpeditionDate).format('YYYY-MM-DD'), // Formato de fecha
      product: {
        ...sale.product,
        price: formatPrice(sale.product.price)
      }
    };

    res.json(formattedSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Creación de una nueva venta
router.post('/', async (req, res) => {
  const {
    clientId,
    clientName,
    clientExpeditionDate,
    clientExpeditionPlace,
    phone,
    address,
    product,
    paymentPlan,
  } = req.body;

  // fecha de expedición a zona horaria colombiana
  const expeditionDate = moment.tz(clientExpeditionDate, 'America/Bogota').startOf('day').toDate();

  // Validación del precio del producto
  if (!product || typeof product.price !== 'number') {
    return res.status(400).json({ message: 'El precio del producto es requerido y debe ser un número.' });
  }

  const sale = new Sale({
    clientId,
    clientName,
    clientExpeditionDate: expeditionDate, 
    clientExpeditionPlace,
    phone,
    address,
    product,
    paymentPlan,
    user: req.userId, // Usuario autenticado
  });

  try {
    const newSale = await sale.save();
    const populatedSale = await Sale.findById(newSale._id).populate('user', 'username -_id');

    const formattedSale = {
      ...populatedSale.toObject(),
      clientExpeditionDate: moment(populatedSale.clientExpeditionDate).format('YYYY-MM-DD'), // Formato de fecha
      product: {
        ...populatedSale.product,
        price: formatPrice(populatedSale.product.price)
      }
    };

    res.status(201).json(formattedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualización de una venta
router.put('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const {
      clientName,
      clientExpeditionDate,
      clientExpeditionPlace,
      phone,
      address,
      product,
      paymentPlan,
    } = req.body;

    
    if (clientExpeditionDate) {
      sale.clientExpeditionDate = moment.tz(clientExpeditionDate, 'America/Bogota').startOf('day').toDate();
    }

    sale.clientName = clientName || sale.clientName;
    sale.clientExpeditionPlace = clientExpeditionPlace || sale.clientExpeditionPlace;
    sale.phone = phone || sale.phone;
    sale.address = address || sale.address;
    sale.product = product || sale.product;
    sale.paymentPlan = paymentPlan || sale.paymentPlan;

    const updatedSale = await sale.save();
    const populatedSale = await Sale.findById(updatedSale._id).populate('user', 'username -_id');

    const formattedSale = {
      ...populatedSale.toObject(),
      clientExpeditionDate: moment(populatedSale.clientExpeditionDate).format('YYYY-MM-DD'), // Formato de fecha
      product: {
        ...populatedSale.product,
        price: formatPrice(populatedSale.product.price)
      }
    };

    res.json(formattedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }  
});

// Eliminación de una venta
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Intentando eliminar la venta con ID: ${req.params.id}`);
    
    const sale = await Sale.findByIdAndDelete(req.params.id); 
    if (!sale) {
      console.log('Venta no encontrada');
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    console.log('Venta eliminada con éxito');
    res.json({ message: 'Venta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
