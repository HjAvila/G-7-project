<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InventoryItemController extends Controller
{
    /**
     * Read: List all inventory items.
     */
    public function index()
    {
        return response()->json(
            InventoryItem::orderByDesc('id')->get()
        );
    }

    /**
     * Create: Store a new inventory item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => [
                'required',
                'string',
                'max:100',
                'unique:inventory_items,sku',
            ],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'quantity' => ['required', 'integer', 'min:0'],
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
                'decimal:0,2',
            ],
        ]);

        $item = InventoryItem::create($validated);

        return response()->json([
            'message' => 'Inventory item created successfully.',
            'data' => $item,
        ], 201);
    }

    /**
     * Read: Show a single inventory item.
     */
    public function show(InventoryItem $inventoryItem)
    {
        return response()->json($inventoryItem);
    }

    /**
     * Update: Modify an existing inventory item.
     */
    public function update(
        Request $request,
        InventoryItem $inventoryItem
    ) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => [
                'required',
                'string',
                'max:100',
                Rule::unique('inventory_items', 'sku')
                    ->ignore($inventoryItem->id),
            ],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'quantity' => ['required', 'integer', 'min:0'],
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
                'decimal:0,2',
            ],
        ]);

        $inventoryItem->update($validated);

        return response()->json([
            'message' => 'Inventory item updated successfully.',
            'data' => $inventoryItem->fresh(),
        ]);
    }

    /**
     * Delete: Remove an inventory item.
     */
    public function destroy(InventoryItem $inventoryItem)
    {
        $inventoryItem->delete();

        return response()->json([
            'message' => 'Inventory item deleted successfully.',
        ]);
    }
}
